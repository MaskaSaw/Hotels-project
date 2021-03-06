﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

namespace Hotels.JsonConverters
{
    public class TimeSpanConverter: JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options
        )
        {
            var value = reader.GetString();

            if (TimeSpan.TryParseExact(
                value,
                "h\\:mm",
                CultureInfo.InvariantCulture,
                TimeSpanStyles.None,
                out var interval)
            )
            {
                return interval;
            }

            throw new JsonException($"Failed to convert object {value} to TimeSpan");
        }

        public override void Write(
            Utf8JsonWriter writer,
            TimeSpan value,
            JsonSerializerOptions options
        )
        {
            writer.WriteStringValue(value.ToString("h\\:mm", CultureInfo.InvariantCulture));
        }
    }
}
